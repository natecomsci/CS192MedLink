<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>
<label>
  Service Phone Number
  <input 
    type="tel"
    placeholder="+63 9"
    value="+63 9"
  >
</label>

<label>
  Base Rate
  <input 
    type="number"
    placeholder=1000
    class = "w-20"
  >
  pesos
</label>

<label>
  Available Beds
  <input 
    type="number"
    placeholder=3
    class = "w-20"
  >
</label>

<label>
  <input 
    type="checkbox"
  >
  Cardiac Support
</label>

<label>
  <input 
    type="checkbox"
  >
  Neurological Support
</label>

<label>
  <input 
    type="checkbox"
  >
  Renal Support
</label>

<label>
  <input 
    type="checkbox"
  >
  Respiratory Support
</label>
