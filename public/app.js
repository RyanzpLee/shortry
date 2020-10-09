const app = new Vue({
  el: '#app',
  data: {
    url: '',
    alias: '',
    error: '',
    formVisible: true,
    created: null,
  },
  methods: {
    async createUrl() {
      this.error = '';
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          url: this.url,
          alias: this.alias || undefined,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        this.formVisible = false;
        this.created = `https://shortry.herokuapp.com/${result.alias}`;
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },
  },
});
