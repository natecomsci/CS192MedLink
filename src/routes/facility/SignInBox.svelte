<script lang='ts'>
	export let id = "";
	export let password = "";
	export let show = false;
</script>


<div class="bg-gray-400 m-6 space-y-2 rounded-2xl p-6">
	<h3>SIGN IN</h3>

	<input 
		bind:value={id} 
		placeholder="ID"
		class="bg-purple-300 rounded-2xl"
	/>

	<div class ="bg-purple-300 rounded-2xl">

		<input 
			bind:value={password} 
			placeholder="Password"
		/>

		<button 
			onclick={() => show = !show}
		>
			{show ? "Hide" : "Show"}
		</button>

	</div>

	<!-- to change to function check -->
	<a class="bg-purple-800 rounded-2xl" href="/dashboard">Sign In</a>

</div>
