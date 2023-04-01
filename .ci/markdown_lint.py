"""Markdown linting script."""

import sys
import anyio
import dagger
import threading

async def markdown_lint():
    lint_rules_to_ignore = ["MD013","MD003","MD041","MD022","MD023","MD033","MD019"]

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")

        lint = (
            client.container().from_("python:3.10-slim-buster")
            .with_exec("pip install pymarkdownlnt".split(" "))
            .with_mounted_directory("/data", src)
            .with_workdir("/data")
        )
        for i in ["blog", "docs", "i18n"]:
            lint = lint.with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", i, "-r"])
        # execute
        await lint.exit_code()

    print("Markdown lint is FINISHED!")

def run_test(event):
    """Run tests for a single Python version."""
    try:
        anyio.run(markdown_lint)
    except:
        print("Error in thread: ", threading.current_thread().name)
        event.set()

if __name__ == "__main__":
    anyio.run(markdown_lint)