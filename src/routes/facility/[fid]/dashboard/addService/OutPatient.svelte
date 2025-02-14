<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>

<label>
  Base Price
  <input 
    type="number"
    placeholder=100
    class = "w-20"
  >
  pesos
</label>

<label>
  Completion Time
  <input 
    type="number"
    placeholder=1
    id="days"
    class = "w-20"
  >
  days
  <input 
    type="number"
    placeholder=1
    id="hours"
    class = "w-20"
  >
  hours
</label>

<label>
  Availability
  <input 
    type="checkbox"
  >
</label>

<label>
  Accepts Walk-ins
  <input 
    type="checkbox"
  >
</label>
