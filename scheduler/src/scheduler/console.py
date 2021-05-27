#src/scheduler/console.py
import textwrap  # standard library

import click  # Third party packages
import requests

from . import __version__, wikipedia # Local imports

API_URL = "https://en.wikipedia.org/api/rest_v1/page/random/summary"

@click.command()
@click.version_option(version=__version__)
def main():
    """The scheduler Python Project."""
    data = wikipedia.random_page()

    title = data["title"]
    extract = data["extract"]

    click.secho(title, fg="green")
    click.echo(textwrap.fill(extract))