<div class="layout-container">
	<header class="layout-header">
		<slot name="header" />
	</header>

	<main class="layout-main">
		<aside class="layout-sidebar">
			<slot name="sidebar" />
		</aside>

		<section class="layout-content">
			<slot name="content" />
		</section>
	</main>
</div>

<style lang="scss">
	.layout-container {
		display: grid;
		grid-template-rows: auto 1fr;
		width: 100%;
		height: 100%;
		border: 1px solid #ddd;

		.layout-header {
			grid-row: 1;
			background-color: #f5f5f5; // 轻微背景色区分
			height: 60px;
		}

		.layout-main {
			grid-row: 2;
			display: grid;
			grid-template-columns: 8fr 3fr;
			height: 100%;
			gap: 20px; // 主体区域左右部分间的小间隙
			background-color: #f5f5f5; // 间隙颜色，模拟分割线效果

			.layout-sidebar {
				grid-column: 1;
				padding: 1rem;
				overflow-y: auto;
				background-color: white; // 背景色
			}

			.layout-content {
				grid-column: 2;
				overflow-y: auto;
				background-color: white; // 背景色
			}
		}
	}
</style>
