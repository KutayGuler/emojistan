<script lang="ts">
	import type { PostgrestSingleResponse } from '@supabase/supabase-js';
	import type { ComponentType } from 'svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { notifications } from '../notifications';
	export let component: ComponentType;
	export let data: Array<any> = [];
	export let wrap = false;
	export let supabaseQuery: (
		from: number,
		to: number
	) => Promise<PostgrestSingleResponse<any>>;

	let paginationCount = 9;
	let paginating = false;
	let intersecting: boolean;
	let element: HTMLDivElement;
	let paginatedIndexes: Array<number> = [];

	async function paginate() {
		if (paginating || paginatedIndexes.includes(data.length - 1)) {
			return;
		}

		paginating = true;
		paginatedIndexes.push(data.length - 1);

		let { data: _data, error: _error } = await supabaseQuery(
			paginationCount + 1,
			paginationCount + 10
		);

		paginationCount += 10;
		paginating = false;

		if (Array.isArray(_data)) {
			data = [...data, ..._data];
		} else if (_error) {
			notifications.warning("An error occured while trying to get the data.")
		}
	}
</script>

{#if data}
	<div
		class="h-full overflow-y-auto overflow-x-hidden px-1 {wrap
			? 'flex flex-wrap'
			: ''}"
	>
		{#each data || [] as props, index}
			{#if index == data.length - 1}
				<svelte:component
					this={component}
					{index}
					{...props}
					bind:div={element}
				/>
			{:else}
				<!-- TODO: figure this animation shit out -->
				<svelte:component
					this={component}
					index={index < paginationCount ? 0 : paginationCount - index}
					{...props}
				/>
			{/if}
		{/each}
	</div>

	<IntersectionObserver
		{element}
		bind:intersecting
		on:intersect={paginate}
		threshold={1}
	/>

	{#if paginating}
		<button
			class="loading btn-ghost btn-lg btn scale-150 border-none hover:border-none"
		/>
	{/if}
{:else}
	<slot name="fallback" />
{/if}
