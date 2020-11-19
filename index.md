---
layout: 'index'
---

{% for post in site.posts %}
   {% include post_short.html %}
{% endfor %}
