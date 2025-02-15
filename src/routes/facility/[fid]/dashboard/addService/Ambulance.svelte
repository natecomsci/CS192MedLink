<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>
<label>
  Service Phone Number
  <input 
    name="phoneNumber"
    type="tel"
    placeholder="+63 9"
    value="+63 9"
    required 
  >
</label>
<label>
  Operating Time
  <input 
    name="opening"
    type="time"
    value="08:00" 
    required
  >
  <input 
    name="closing" 
    type="time"
    value="16:00" 
    required
  >
</label>

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
  Minimum coverage radius
  <input 
    name="minCoverageRadius" 
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  km
</label>

<label>
  Mileage rate
  <input 
    name="mileageRate"
    type="number"
    placeholder=1.5
    class = "w-20"
    required
  >
</label>

<label>
  Maximum coverage radius
  <input 
    name="maxCoverageRadius" 
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  km
</label>

<label>
  Availability
  <input
    name="availability" 
    type="checkbox"
  >
</label>