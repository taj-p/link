import {Logger} from '@link/logger';
import {
  CardCreated,
  CardEvent,
  CardStored,
  DeleteCardRequested,
  DeletedCard,
  EventPatterns,
  GetAllUserCardsRequested,
  GotAllUserCards,
  GotNextCard,
  NextCardRequested,
  Topics,
} from '@link/schema';
import {Controller, Inject} from '@nestjs/common';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {ClientProxy, EventPattern, Transport} from '@nestjs/microservices';
import {KafkaMessage} from 'kafkajs';
import {RepositoryService} from './../services/repository.service';

@Controller()
export class CardStoreController {
  private logger = Logger.create('CardStoreController');

  constructor(
    @Inject('KAFKA') private client: ClientProxy,
    private repositoryService: RepositoryService,
    private eventEmitter: EventEmitter2
  ) {}

  /**
   * Only listen to the `Card` topic and emit the events for
   * our controller methods to listen to.
   */
  @EventPattern(Topics.card, Transport.KAFKA)
  async handleCard(event: KafkaMessage) {
    const cardEvent = (event.value as unknown) as CardEvent;
    this.logger.info('Received card event from Kafka', event);

    this.eventEmitter.emit(cardEvent.pattern, cardEvent.payload);
  }

  /**
   * Emits the next card.
   */
  @OnEvent(EventPatterns.nextCardRequested)
  async handleNextCardRequested(payload: NextCardRequested) {
    const result = await this.repositoryService.nextCard();

    const nextCard: GotNextCard = {
      uuid: payload.uuid,
      timestamp: new Date(),
      source: 'Card Store',
      userCard: result.data,
      error: result.error,
    };

    const eventToEmit: CardEvent = {
      pattern: EventPatterns.gotNextCard,
      payload: nextCard,
    };

    this.logger.info(
      `Emitting ${EventPatterns.gotNextCard} event`,
      eventToEmit
    );
    this.client.emit(Topics.card, {key: payload.uuid, value: eventToEmit});
  }

  /**
   * Get all the user cards and emit an event with all `userCards`.
   */
  @OnEvent(EventPatterns.getAllUserCardsRequested)
  async handleGetAllUserCardsRequested(payload: GetAllUserCardsRequested) {
    const result = await this.repositoryService.userCards();

    const userCards: GotAllUserCards = {
      uuid: payload.uuid,
      timestamp: new Date(),
      source: 'Card Store',
      cards: result.data,
      error: result.error,
    };

    const eventToEmit: CardEvent = {
      pattern: EventPatterns.gotAllUserCards,
      payload: userCards,
    };

    this.logger.info(
      `Emitting ${EventPatterns.gotAllUserCards} event`,
      eventToEmit
    );
    this.client.emit(Topics.card, {key: payload.uuid, value: eventToEmit});
  }

  /**
   * Delete the card and emit a `DeletedCard` event.
   */
  @OnEvent(EventPatterns.deleteCardRequested)
  async handleDeleteCardRequested(payload: DeleteCardRequested) {
    const result = await this.repositoryService.deleteCard(payload.cardId);

    const deletedCard: DeletedCard = {
      uuid: payload.uuid,
      timestamp: new Date(),
      source: 'Card Store',
      cardId: payload.cardId,
      error: result.error,
    };

    const eventToEmit: CardEvent = {
      pattern: EventPatterns.deletedCard,
      payload: deletedCard,
    };

    this.logger.info(
      `Emitting ${EventPatterns.deletedCard} event`,
      eventToEmit
    );
    this.client.emit(Topics.card, {key: payload.uuid, value: eventToEmit});
  }

  /**
   * Store the card and emit a `CardStored` event.
   */
  @OnEvent(EventPatterns.cardCreated, {async: true, nextTick: true})
  async handleCardCreated(payload: CardCreated) {
    const result = await this.repositoryService.saveCard(payload.card);

    const cardStored: CardStored = {
      uuid: payload.uuid,
      timestamp: new Date(),
      source: 'Card Store',
      cardId: result.data,
      error: result.error,
    };

    const eventToEmit: CardEvent = {
      pattern: EventPatterns.cardStored,
      payload: cardStored,
    };

    this.logger.info(`Emitting ${EventPatterns.cardStored} event`, eventToEmit);
    this.client.emit(Topics.card, {key: payload.uuid, value: eventToEmit});
  }
}
