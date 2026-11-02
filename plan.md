==> Downloading cache...
==> Cloning from https://github.com/subhajitm6/work-pulse
==> Checking out commit b92b969066a684693442fdab5e00110c7c47bbff in branch main
==> Downloaded and extracted 26 MiB cache in 6s.
==> Using Python version 3.14.8 (default)
==> Docs on specifying a Python version: https://render.com/docs/python-version
==> Installing Python version 3.14.8...
==> Using Poetry version 2.1.3 (default)
==> Docs on specifying a Poetry version: https://render.com/docs/poetry-version
==> Running build command 'pip install -r requirements.txt'...
Collecting fastapi>=0.115.0 (from -r requirements.txt (line 1))
  Using cached fastapi-0.162.0-py3-none-any.whl.metadata (26 kB)
Collecting uvicorn>=0.32.0 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached uvicorn-0.54.0-py3-none-any.whl.metadata (6.6 kB)
Collecting pydantic>=2.10.0 (from -r requirements.txt (line 3))
  Using cached pydantic-2.14.2-py3-none-any.whl.metadata (137 kB)
Collecting pydantic-settings>=2.6.0 (from -r requirements.txt (line 4))
  Using cached pydantic_settings-2.16.2-py3-none-any.whl.metadata (4.0 kB)
Collecting sqlalchemy>=2.0.36 (from -r requirements.txt (line 5))
  Using cached sqlalchemy-2.1.6-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (9.7 kB)
Collecting psycopg>=3.2.3 (from psycopg[binary]>=3.2.3->-r requirements.txt (line 6))
  Using cached psycopg-3.3.6-py3-none-any.whl.metadata (4.4 kB)
Collecting alembic>=1.14.0 (from -r requirements.txt (line 7))
  Using cached alembic-1.20.1-py3-none-any.whl.metadata (7.3 kB)
Collecting pyjwt>=2.10.0 (from -r requirements.txt (line 8))
  Using cached pyjwt-2.15.1-py3-none-any.whl.metadata (3.5 kB)
Collecting argon2-cffi>=23.1.0 (from -r requirements.txt (line 9))
  Using cached argon2_cffi-25.1.0-py3-none-any.whl.metadata (4.1 kB)
Collecting python-multipart>=0.0.19 (from -r requirements.txt (line 10))
  Using cached python_multipart-0.0.33-py3-none-any.whl.metadata (6.3 kB)
Collecting pytest>=8.3.0 (from -r requirements.txt (line 11))
  Using cached pytest-9.2.0-py3-none-any.whl.metadata (7.9 kB)
Collecting httpx>=0.28.0 (from -r requirements.txt (line 12))
  Using cached httpx-0.28.1-py3-none-any.whl.metadata (7.1 kB)
Collecting starlette>=0.46.0 (from fastapi>=0.115.0->-r requirements.txt (line 1))
  Using cached starlette-1.10.0-py3-none-any.whl.metadata (6.6 kB)
Collecting typing-extensions>=4.8.0 (from fastapi>=0.115.0->-r requirements.txt (line 1))
  Using cached typing_extensions-4.16.0-py3-none-any.whl.metadata (3.3 kB)
Collecting typing-inspection>=0.4.2 (from fastapi>=0.115.0->-r requirements.txt (line 1))
  Using cached typing_inspection-0.4.4-py3-none-any.whl.metadata (2.6 kB)
Collecting annotated-doc>=0.0.2 (from fastapi>=0.115.0->-r requirements.txt (line 1))
  Using cached annotated_doc-0.0.5-py3-none-any.whl.metadata (6.5 kB)
Collecting opentelemetry-api>=1.44.0 (from fastapi>=0.115.0->-r requirements.txt (line 1))
  Using cached opentelemetry_api-1.45.2-py3-none-any.whl.metadata (1.4 kB)
Collecting click>=7.0 (from uvicorn>=0.32.0->uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached click-8.5.0-py3-none-any.whl.metadata (2.6 kB)
Collecting h11>=0.8 (from uvicorn>=0.32.0->uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached h11-0.16.0-py3-none-any.whl.metadata (8.3 kB)
Collecting annotated-types>=0.6.0 (from pydantic>=2.10.0->-r requirements.txt (line 3))
  Using cached annotated_types-0.8.0-py3-none-any.whl.metadata (15 kB)
Collecting pydantic-core==2.50.2 (from pydantic>=2.10.0->-r requirements.txt (line 3))
  Using cached pydantic_core-2.50.2-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl.metadata (6.5 kB)
Collecting python-dotenv>=1.2.2 (from pydantic-settings>=2.6.0->-r requirements.txt (line 4))
  Using cached python_dotenv-1.2.4-py3-none-any.whl.metadata (29 kB)
Collecting Mako (from alembic>=1.14.0->-r requirements.txt (line 7))
  Using cached mako-1.4.3-py3-none-any.whl.metadata (2.9 kB)
Collecting argon2-cffi-bindings (from argon2-cffi>=23.1.0->-r requirements.txt (line 9))
  Using cached argon2_cffi_bindings-26.1.0-cp310-abi3-manylinux_2_26_x86_64.manylinux_2_28_x86_64.whl.metadata (7.5 kB)
Collecting iniconfig>=2 (from pytest>=8.3.0->-r requirements.txt (line 11))
  Using cached iniconfig-2.3.1-py3-none-any.whl.metadata (2.8 kB)
Collecting packaging>=24 (from pytest>=8.3.0->-r requirements.txt (line 11))
  Using cached packaging-26.3-py3-none-any.whl.metadata (3.5 kB)
Collecting pluggy<2,>=1.6 (from pytest>=8.3.0->-r requirements.txt (line 11))
  Using cached pluggy-1.7.0-py3-none-any.whl.metadata (5.0 kB)
Collecting pygments>=2.15 (from pytest>=8.3.0->-r requirements.txt (line 11))
  Using cached pygments-2.21.0-py3-none-any.whl.metadata (2.5 kB)
Collecting anyio (from httpx>=0.28.0->-r requirements.txt (line 12))
  Using cached anyio-4.16.0-py3-none-any.whl.metadata (4.7 kB)
Collecting certifi (from httpx>=0.28.0->-r requirements.txt (line 12))
  Using cached certifi-2026.10.23-py3-none-any.whl.metadata (2.5 kB)
Collecting httpcore==1.* (from httpx>=0.28.0->-r requirements.txt (line 12))
  Using cached httpcore-1.0.9-py3-none-any.whl.metadata (21 kB)
Collecting idna (from httpx>=0.28.0->-r requirements.txt (line 12))
  Using cached idna-3.20-py3-none-any.whl.metadata (7.2 kB)
Collecting psycopg-binary==3.3.6 (from psycopg[binary]>=3.2.3->-r requirements.txt (line 6))
  Using cached psycopg_binary-3.3.6-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl.metadata (2.7 kB)
Collecting httptools>=0.8.0 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached httptools-0.9.0-cp314-cp314-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl.metadata (3.5 kB)
Collecting pyyaml>=5.1 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached pyyaml-6.0.3-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (2.4 kB)
Collecting uvloop>=0.15.1 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached uvloop-0.23.0-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (5.1 kB)
Collecting watchfiles>=0.20 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached watchfiles-1.3.0-cp310-abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.whl.metadata (4.9 kB)
Collecting websockets>=13.0 (from uvicorn[standard]>=0.32.0->-r requirements.txt (line 2))
  Using cached websockets-17.4-cp314-cp314-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl.metadata (6.3 kB)
Collecting cffi>=2 (from argon2-cffi-bindings->argon2-cffi>=23.1.0->-r requirements.txt (line 9))
  Using cached cffi-2.1.1-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl.metadata (2.5 kB)
Collecting pycparser (from cffi>=2->argon2-cffi-bindings->argon2-cffi>=23.1.0->-r requirements.txt (line 9))
  Using cached pycparser-3.12-py3-none-any.whl.metadata (9.7 kB)
Collecting MarkupSafe>=2.0 (from Mako->alembic>=1.14.0->-r requirements.txt (line 7))
  Using cached markupsafe-3.0.4-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl.metadata (2.7 kB)
Using cached fastapi-0.162.0-py3-none-any.whl (148 kB)
Using cached uvicorn-0.54.0-py3-none-any.whl (87 kB)
Using cached pydantic-2.14.2-py3-none-any.whl (490 kB)
Using cached pydantic_core-2.50.2-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl (2.2 MB)
Using cached pydantic_settings-2.16.2-py3-none-any.whl (81 kB)
Using cached sqlalchemy-2.1.6-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (4.6 MB)
Using cached psycopg-3.3.6-py3-none-any.whl (215 kB)
Using cached alembic-1.20.1-py3-none-any.whl (270 kB)
Using cached pyjwt-2.15.1-py3-none-any.whl (33 kB)
Using cached argon2_cffi-25.1.0-py3-none-any.whl (14 kB)
Using cached python_multipart-0.0.33-py3-none-any.whl (32 kB)
Using cached pytest-9.2.0-py3-none-any.whl (411 kB)
Using cached pluggy-1.7.0-py3-none-any.whl (27 kB)
Using cached httpx-0.28.1-py3-none-any.whl (73 kB)
Using cached httpcore-1.0.9-py3-none-any.whl (78 kB)
Using cached annotated_doc-0.0.5-py3-none-any.whl (5.3 kB)
Using cached annotated_types-0.8.0-py3-none-any.whl (13 kB)
Using cached click-8.5.0-py3-none-any.whl (125 kB)
Using cached h11-0.16.0-py3-none-any.whl (37 kB)
Using cached iniconfig-2.3.1-py3-none-any.whl (7.6 kB)
Using cached opentelemetry_api-1.45.2-py3-none-any.whl (60 kB)
Using cached packaging-26.3-py3-none-any.whl (129 kB)
Using cached psycopg_binary-3.3.6-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl (5.2 MB)
Using cached pygments-2.21.0-py3-none-any.whl (1.3 MB)
Using cached python_dotenv-1.2.4-py3-none-any.whl (23 kB)
Using cached starlette-1.10.0-py3-none-any.whl (80 kB)
Using cached anyio-4.16.0-py3-none-any.whl (134 kB)
Using cached idna-3.20-py3-none-any.whl (69 kB)
Using cached typing_extensions-4.16.0-py3-none-any.whl (45 kB)
Using cached typing_inspection-0.4.4-py3-none-any.whl (14 kB)
Using cached httptools-0.9.0-cp314-cp314-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl (514 kB)
Using cached pyyaml-6.0.3-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (794 kB)
Using cached uvloop-0.23.0-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (4.4 MB)
Using cached watchfiles-1.3.0-cp310-abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (458 kB)
Using cached websockets-17.4-cp314-cp314-manylinux1_x86_64.manylinux_2_28_x86_64.manylinux_2_5_x86_64.whl (226 kB)
Using cached argon2_cffi_bindings-26.1.0-cp310-abi3-manylinux_2_26_x86_64.manylinux_2_28_x86_64.whl (26 kB)
Using cached cffi-2.1.1-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.whl (221 kB)
Using cached certifi-2026.10.23-py3-none-any.whl (135 kB)
Using cached mako-1.4.3-py3-none-any.whl (80 kB)
Using cached markupsafe-3.0.4-cp314-cp314-manylinux2014_x86_64.manylinux_2_17_x86_64.manylinux_2_28_x86_64.whl (23 kB)
Using cached pycparser-3.12-py3-none-any.whl (62 kB)
Installing collected packages: websockets, uvloop, typing-extensions, pyyaml, python-multipart, python-dotenv, pyjwt, pygments, pycparser, psycopg-binary, psycopg, pluggy, packaging, MarkupSafe, iniconfig, idna, httptools, h11, click, certifi, annotated-types, annotated-doc, uvicorn, typing-inspection, sqlalchemy, pytest, pydantic-core, opentelemetry-api, Mako, httpcore, cffi, anyio, watchfiles, starlette, pydantic, httpx, argon2-cffi-bindings, alembic, pydantic-settings, fastapi, argon2-cffi

Successfully installed Mako-1.4.3 MarkupSafe-3.0.4 alembic-1.20.1 annotated-doc-0.0.5 annotated-types-0.8.0 anyio-4.16.0 argon2-cffi-25.1.0 argon2-cffi-bindings-26.1.0 certifi-2026.10.23 cffi-2.1.1 click-8.5.0 fastapi-0.162.0 h11-0.16.0 httpcore-1.0.9 httptools-0.9.0 httpx-0.28.1 idna-3.20 iniconfig-2.3.1 opentelemetry-api-1.45.2 packaging-26.3 pluggy-1.7.0 psycopg-3.3.6 psycopg-binary-3.3.6 pycparser-3.12 pydantic-2.14.2 pydantic-core-2.50.2 pydantic-settings-2.16.2 pygments-2.21.0 pyjwt-2.15.1 pytest-9.2.0 python-dotenv-1.2.4 python-multipart-0.0.33 pyyaml-6.0.3 sqlalchemy-2.1.6 starlette-1.10.0 typing-extensions-4.16.0 typing-inspection-0.4.4 uvicorn-0.54.0 uvloop-0.23.0 watchfiles-1.3.0 websockets-17.4

[notice] A new release of pip is available: 26.2.1 -> 26.2.2
[notice] To update, run: pip install --upgrade pip
==> Uploading build...
==> Uploaded in 2.6s. Compression took 1.8s
==> Build successful 🎉
==> Deploying...
==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
==> Running 'uvicorn app.main:app --host 0.0.0.0 --port $PORT'
Traceback (most recent call last):
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/networks.py", line 1040, in import_email_validator
    import email_validator
ModuleNotFoundError: No module named 'email_validator'

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/opt/render/project/src/.venv/bin/uvicorn", line 6, in <module>
    sys.exit(main())
             ~~~~^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/click/core.py", line 1631, in __call__
    return self.main(*args, **kwargs)
           ~~~~~~~~~^^^^^^^^^^^^^^^^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/click/core.py", line 1552, in main
    rv = self.invoke(ctx)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/click/core.py", line 1415, in invoke
    return ctx.invoke(self.callback, **ctx.params)
           ~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/click/core.py", line 910, in invoke
    return callback(*args, **kwargs)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/uvicorn/main.py", line 448, in main
    run(
    ~~~^
        app,
        ^^^^
    ...<49 lines>...
        reset_contextvars=reset_contextvars,
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/uvicorn/main.py", line 620, in run
    config.load_app()
    ~~~~~~~~~~~~~~~^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/uvicorn/config.py", line 434, in load_app
    return import_from_string(self.app)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/uvicorn/importer.py", line 19, in import_from_string
    module = importlib.import_module(module_str)
  File "/opt/render/project/python/Python-3.14.8/lib/python3.14/importlib/__init__.py", line 88, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1406, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1371, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1342, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 938, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 763, in exec_module
  File "<frozen importlib._bootstrap>", line 491, in _call_with_frames_removed
  File "/opt/render/project/src/backend/app/main.py", line 6, in <module>
    from app.api.routes import auth, workspaces, tasks, projects, daily_logs, analytics
  File "/opt/render/project/src/backend/app/api/routes/auth.py", line 7, in <module>
    from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut, UserUpdate
  File "/opt/render/project/src/backend/app/schemas/schemas.py", line 7, in <module>
    class UserBase(BaseModel):
    ...<3 lines>...
        avatar: Optional[str] = None
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_model_construction.py", line 253, in __new__
    complete_model_class(
    ~~~~~~~~~~~~~~~~~~~~^
        cls,
        ^^^^
    ...<3 lines>...
        create_model_module=_create_model_module,
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_model_construction.py", line 628, in complete_model_class
    schema = gen_schema.generate_schema(cls)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 826, in generate_schema
    schema = self._generate_schema_inner(obj, origin)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 1131, in _generate_schema_inner
    return self._model_schema(obj)
           ~~~~~~~~~~~~~~~~~~^^^^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 953, in _model_schema
    {k: self._generate_md_field_schema(k, v, decorators) for k, v in fields.items()},
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 1263, in _generate_md_field_schema
    schema, metadata = self._common_field_schema(name, field_info, decorators)
                       ~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 1320, in _common_field_schema
    schema = self._apply_annotations(
        source_type,
        annotations + validators_from_decorators,
    )
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 2328, in _apply_annotations
    schema = get_inner_schema(source_type)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_schema_generation_shared.py", line 84, in __call__
    schema = self._handler(source_type)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 2303, in inner_handler
    schema = self._generate_schema_from_get_schema_method(obj, source_type)
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/_internal/_generate_schema.py", line 1013, in _generate_schema_from_get_schema_method
    schema = get_schema(
        source, CallbackGetCoreSchemaHandler(self._generate_schema_inner, self, ref_mode=ref_mode)
    )
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/networks.py", line 1080, in __get_pydantic_core_schema__
    import_email_validator()
    ~~~~~~~~~~~~~~~~~~~~~~^^
  File "/opt/render/project/src/.venv/lib/python3.14/site-packages/pydantic/networks.py", line 1042, in import_email_validator
    raise ImportError("email-validator is not installed, run `pip install 'pydantic[email]'`") from e
ImportError: email-validator is not installed, run `pip install 'pydantic[email]'`
==> Exited with status 1
==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys
==> Running 'uvicorn app.main:app --host 0.0.0.0 --port $PORT'