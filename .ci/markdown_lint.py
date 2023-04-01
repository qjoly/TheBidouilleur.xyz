"""Run tests for a single Python version."""

import sys
import anyio
import dagger



async def markdown_lint():
    lint_rules_to_ignore = ["MD013","MD003","MD041","MD022","MD023","MD033","MD019"]

    async with dagger.Connection(dagger.Config(log_output=sys.stderr)) as client:
        src = client.host().directory("./")

        lint = (
            client.container().from_("python:3.10-slim-buster")
            .with_exec("pip install pymarkdownlnt".split(" "))
            .with_mounted_directory("/data", src)
            .with_workdir("/data")
            .with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", "blog", "-r"])
            .with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", "docs", "-r"])
            .with_exec(["pymarkdownlnt", "-d", str(','.join(lint_rules_to_ignore)), "scan", "i18n", "-r"])
        )
        # execute
        await lint.exit_code()

    print("Tests succeeded!")


if __name__ == "__main__":
    anyio.run(markdown_lint)