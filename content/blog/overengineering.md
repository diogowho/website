---
title: "Overengineering"
description: "How a small self-hosting hobby became a personal network, a Kubernetes cluster, and a very voluntary on-call shift."
pubDate: 2026-08-02
---

There is a particular kind of happiness in looking at a problem with an extremely small blast radius and thinking: _surely this deserves a control plane._

I run my own network. It is a fairly new development: I got my ASN, [AS207118](https://as207118.net), in January. Before that, I had no networking background worth mentioning. I actively **hated** networking classes in high school and university. My experience mostly stopped at the pleasant, low-stakes end of servers: containers, Discord bots, and Minecraft servers.

I am not doing this because it pays the bills or because anything important depends on it. I do it because handing every decision to a company somewhere else felt a little too quiet. I wanted to understand the machinery, and perhaps have a few more knobs than strictly necessary.

What began as curiosity has a habit of collecting responsibilities. A service needs somewhere to live; that service needs backups; the backups would be easier to trust with a little monitoring. Soon enough, a harmless idea has a checklist, a diagram, and a maintenance window that exists mostly for the pleasure of having one.

None of this is especially practical at this scale. That is part of the appeal. It is a place to make decisions slowly, get them wrong safely, and learn why the boring-looking pieces matter in the first place.

At some point, keeping a few things running stopped being the whole point. I wanted to see how far I could take it, learn the parts I had always avoided, and give myself the kind of problems that only appear once you have made a quiet evening slightly too interesting.

## The full-time-job bit

The slightly embarrassing truth is that I enjoy the maintenance too.

I like the feeling of tracing a failure from a vague symptom to one wrong line in a config. I like making a dashboard for something that absolutely did not need a dashboard. I like knowing which machine is doing what and getting irrationally pleased when a change rolls out cleanly.

Somehow, it has become a full-time job that nobody hired me for. The on-call rota has one name on it, and when I broke routing at 1am, nobody demanded a postmortem. I still have a status page, obviously.

And it is not only a networking thing. When I start a new project, part of my brain immediately imagines the version that lives inside a very serious company: the logs, the alerts, the deployment pipeline, the Grafana dashboards, the Sentry project. Grafana for this, Sentry for that. Most of it is not required. That has never been a particularly persuasive argument.

The work is satisfying precisely because it is mine: the trade-offs, the strange edges, and the deeply unnecessary amount of control.

## A reasonable conclusion, ignored

Overengineering is only bad when it gets in the way of the thing you wanted to make. Sometimes the thing I want to make is a network that feels like a tiny, over-cared-for utility company.

So yes, I could use a simpler setup. I could spend less time thinking about routes, redundancy, and whether a service with three users needs its own monitoring. But then I would miss the part where a tiny problem becomes an excuse to learn something new.

And really, what is a hobby for if not creating a small, lovingly maintained organisation that happens to have exactly one employee?
