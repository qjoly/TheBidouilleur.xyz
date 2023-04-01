
```bash
pip install dagger-io
```

à partir d'un **Python 3.10.6** (Supporté par Dagger.io) :

```bash
➜  ~ python3 -m pip install dagger-io 
Defaulting to user installation because normal site-packages is not writeable
Collecting dagger-io
  Using cached dagger_io-0.4.2-py3-none-any.whl (52 kB)
Collecting cattrs>=22.2.0
[...]
  Using cached mdurl-0.1.2-py3-none-any.whl (10.0 kB)
Collecting multidict>=4.0
  Using cached multidict-6.0.4-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (114 kB)
ERROR: Exception:
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/pip/_internal/cli/base_command.py", line 165, in exc_logging_wrapper
    status = run_func(*args)
  File "/usr/lib/python3/dist-packages/pip/_internal/cli/req_command.py", line 205, in wrapper
    return func(self, options, args)
  File "/usr/lib/python3/dist-packages/pip/_internal/commands/install.py", line 389, in run
    to_install = resolver.get_installation_order(requirement_set)
  File "/usr/lib/python3/dist-packages/pip/_internal/resolution/resolvelib/resolver.py", line 188, in get_installation_order
    weights = get_topological_weights(
  File "/usr/lib/python3/dist-packages/pip/_internal/resolution/resolvelib/resolver.py", line 276, in get_topological_weights
    assert len(weights) == expected_node_count
AssertionError
```

```bash
pip install --upgrade pip setuptools
```
