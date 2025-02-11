<script lang='ts'>
	let { fid=$bindable(), password=$bindable() } = $props();
	let show = $state(true);

	import { goto } from '$app/navigation';

</script>



<!-- @elle, @paul: padesign -->
<form 
	class="bg-gray-400 m-6 space-y-2 rounded-2xl p-6 "
>

	<h3>SIGN IN</h3>


	<div>
		<label class="label">
			<input 
				bind:value={fid}
				name="Facility ID"
				class="input" 
				type="text" 
				placeholder="ID" 
				required 
			/>
		</label>
	</div>
		
	<div>
		<label class="label">

			<input 
				bind:value={password}
				name="Password"
				class="input" 
				type={show ? 'text' : 'password'}
				placeholder="Password"
				required 
			/>

			<button 
				class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
				type="button" 
				onclick="{ () => show = !show }"
			>
				{show ? 'Hide' : 'Show'}
			</button>


		</label>

	</div>
		

	<!-- to change to function check -->
	<button 
		class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800" 
		onclick="{ () => goto('./facility/' + fid + '/dashboard') }"
	>
		Sign In
	</button>

</form>

