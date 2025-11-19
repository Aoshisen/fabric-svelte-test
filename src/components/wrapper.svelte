<div class="wrapper">
	<div class="inner">
		<slot></slot>
	</div>
</div>

<style lang="scss">
	:global {
		body {
			margin: 0;
			padding: 0;
		}
	}
	.wrapper {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		.inner {
			width: 80%;
			height: 80%;
		}
	}
</style>
