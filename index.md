---
layout: 'index'
---

{% for post in site.posts %}
 {% unless post.draft == true %}
   {% include post_short.html %}
 {% endunless %}
{% endfor %}
