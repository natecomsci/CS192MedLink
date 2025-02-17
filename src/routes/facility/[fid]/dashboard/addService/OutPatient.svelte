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
