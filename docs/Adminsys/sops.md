---
slug: sops 
title: Stocker des secrets dans un dépôt Git
tags:
  - gitops
  - sops
---

```yml
creation_rules:
    - path_regex: test.*\.yaml
      key_groups:
      # First key group
      - age:
        - age1upjug3ygl55vswr4wjewuunnr4z74ptfygkgfj44sm0u454egqsqdkdxqq
```
