---
title: "Simon Ward-Jones"
date: 2020-05-15T12:12:20+01:00
draft: false
---

Welcome to my website. I am an Data Scientist living and working in London. This site is very much still a work in progress but I will use it to share some of my little hacks, projects and things I find interesting.

This section is rendered using
```html
{{ define "main" }}
    <main aria-role="main">
      <header class="homepage-header">
        <section class="jumbotron text-center">
          <h1>{{.Title}}</h1>
        </section>
        {{ with .Params.subtitle }}
        <span class="subtitle">{{.}}</span>
        {{ end }}
      </header>
      <div class="homepage-content">
        <div class="container">
          <div class="row">
            <div class="col">
              {{.Content}}
            </div>
          </div>
        </div>
        <!-- Note that the content for index.html, as a sort of list page, will pull from content/_index.md -->
      </div>
      <div>
        {{ range first 10 .Site.RegularPages }}
            {{ .Render "summary"}}
        {{ end }}
      </div>
    </main>
{{ end }}
```