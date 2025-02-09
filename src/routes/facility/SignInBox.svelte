<script lang='ts'>
	import { focusTrap } from '@skeletonlabs/skeleton';

	let { fid=$bindable(), password=$bindable() } = $props();
	let show = $state(true);
</script>

<!-- @elle, @paul: padesign -->
<form 
	use:focusTrap={true} 
	class="bg-gray-400 m-6 space-y-2 rounded-2xl p-6 "
>

	<h3>SIGN IN</h3>


	<div>
		<label class="label">
			<input 
				bind:value={fid}
				class="input" 
				type="text" 
				placeholder="ID" 
				data-focusindex="0" 
			/>
		</label>
	</div>
		
	<div>
		<label class="label">

			<input 
				bind:value={password}
				class="input" 
				type={show ? 'text' : 'password'}
				placeholder="Password"
				data-focusindex="1" 
			/>

			<button 
				class="btn variant-filled" 
				type="button" 
				onclick="{ () => show = !show }"
			>
				{show ? 'Hide' : 'Show'}
			</button>


		</label>

	</div>
		

	<!-- to change to function check -->
	<a class="bg-purple-800 rounded-2xl" href="/facility/{fid}/dashboard">Sign In</a>

</form>
