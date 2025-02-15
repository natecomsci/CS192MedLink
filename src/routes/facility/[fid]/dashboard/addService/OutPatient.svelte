<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>

<label>
  Base Price
  <input 
    name="price" 
    type="number"
    placeholder=100
    class = "w-20"
    required
  >
  pesos
</label>

<label>
  Completion Time
  <input 
    name="completionDays"
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  days
  <input 
    name="completionHours"
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  hours
</label>

<label>
  Availability
  <input 
    name="availability"
    type="checkbox"
    required
  >
</label>

<label>
  Accepts Walk-ins
  <input 
    name="acceptWalkins" 
    type="checkbox"
    required
  >
</label>
