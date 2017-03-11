---
layout: 'index'
---

{% for post in site.posts %}
  {% include post_content.html %}
{% endfor %}