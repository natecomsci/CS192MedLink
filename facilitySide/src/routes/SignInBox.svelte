<script lang='ts'>
	export let id = "";
	export let password = "";
	export let show = false;
</script>


<div class="signInBox">
	<h3>SIGN IN</h3>

	<input 
		bind:value={id} 
		placeholder="ID"
	/>

	<div class ="passwordBox">

		<input 
			bind:value={password} 
			placeholder="Password"
		/>

		<button 
			onclick={() => show ? show = false : show =true}
		>
			Show
		</button>

	</div>

	<!-- to change to function check -->
	<a href="/dashboard">Sign In</a>

</div>


<!-- @paul, @elle padesign-->
<style>
	.signInBox {
		width: 20em;
		height: 20em;
		border-radius: 0.5em;
		margin: 0 0 0 0;

		background-color: #eee;

	    align: center;
	}

	h3 {
		display: flex; 
	    justify-content: left;
	    align-items: left;
	    color: goldenrod;
		font-family: 'Comic Sans MS', cursize;
		font-size: 2em;
		color: #171519;
		font-weight: bold;

	}

	input {
		background-color: #ddd;
		outline-style: solid;
  		outline-color: red;
	}
</style>

