---
title: "{{ replace .Name "_" " " | title }}"
date: {{ .Date }}
draft: true
mathjax: false
menu:
  main:
    parent: 'Posts'
    # weight: 20
    name: "{{ replace .Name "-" " " | title }}"
summary: "Check out my article on {{ replace .Name "_" " " | title }}"
---

