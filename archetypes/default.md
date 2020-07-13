---
title: "{{ replace .Name "_" " " | title }}"
date: {{ .Date }}
draft: true
mathjax: false
menu:
  main:
    parent: 'Posts'
    name: "{{ replace .Name "_" " " | title }}"
summary: "Check out my article on {{ replace .Name "_" " " | title }}"
image: "img/{{ .Name }}.png"
---

