<script>
  let { serviceType} = $props();
</script>

<h3>{serviceType}</h3>
<label>
  <h3>Service Phone Number</h3>
  <p>
    Format: +63 912 345 6789
  </p>
  <input 
    name="phoneNumber"
    type="tel"
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
  Price Per Unit
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
  Turnaround Time
  <input
    name="turnaroundDays"
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  days
  <input 
    name="turnaroundHours"
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
  hours
</label>