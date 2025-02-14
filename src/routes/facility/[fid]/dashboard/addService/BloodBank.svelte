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
  Operating Time
  <input 
    type="time"
    id="opening"
    value="08:00"
  >
  <input 
    type="time"
    id="closing"
    value="16:00" 
  >
</label>

<label>
  Price Per Unit
  <input 
    type="number"
    placeholder=100
    class = "w-20"
  >
  pesos
</label>

<label>
  Turnaround Time
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