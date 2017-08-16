---
layout: 'index'
---

{% for post in site.posts %}
 {% unless post.draft == true %}
   {% include post_content.html %}
 {% endunless %}
{% endfor %}
