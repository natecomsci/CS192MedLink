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
  Base Price
  <input 
    type="number"
    placeholder=100
    class = "w-20"
  >
  pesos
</label>

<label>
  Minimum coverage radius
  <input 
    type="number"
    placeholder=1
    class = "w-20"
  >
  km
</label>

<label>
  Mileage rate
  <input 
    type="number"
    placeholder=1.5
    class = "w-20"
  >
</label>

<label>
  Minimum coverage radius
  <input 
    type="number"
    placeholder=1
    class = "w-20"
  >
  km
</label>

<label>
  Availability
  <input 
    type="checkbox"
  >
</label>