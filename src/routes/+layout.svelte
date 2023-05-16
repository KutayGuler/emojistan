<script>
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import Modal from './Modal.svelte';
</script>

<Toast />

<Modal />

<slot><!-- optional fallback --></slot>
