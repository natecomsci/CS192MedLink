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
