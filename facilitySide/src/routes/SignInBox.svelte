<script>
	let id = $state('ID');
	let password = $state('Password');
	let show = false;

</script>


<div class="box">
	<h3>SIGN IN</h3>
	<input bind:value={id} />
	<div class ="passwordBox">
		<input bind:value={password} />
		<button 
			onclick={() => show ? false : true }

		>Show</button>
	</div>

	<a href="/forgot">forget password?</a>

	<button>Sign In</button>

</div>


<!-- @paul, @elle padesign-->
<style>
	.box {
		width: 20em;
		height: 20em;
		border-radius: 0.5em;
		margin: 0 0 0 0;

		background-color: #eee;

	    align: center;
	}



	h3 {
		display: grid; /* or grid */
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

