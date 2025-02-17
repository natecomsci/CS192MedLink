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
    pattern="+63 9[0-9]{2} [0-9]{3} [0-9]{4}"
    required 
  >
</label>
<label>
  Base Rate
  <input 
    name="price" 
    type="number"
    placeholder=1000
    class = "w-20"
    required
  >
  pesos
</label>

<label>
  Available Beds
  <input 
    name="availableBeds" 
    type="number"
    placeholder=3
    class = "w-20"
    required
  >
</label>

<label>
  <input 
    name="cardiacSupport" 
    type="checkbox"
  >
  Cardiac Support
</label>

<label>
  <input 
    name="neurologicalSupport" 
    type="checkbox"
  >
  Neurological Support
</label>

<label>
  <input 
    name="renalSupport" 
    type="checkbox"
  >
  Renal Support
</label>

<label>
  <input 
    name="respiratorySupport" 
    type="checkbox"
  >
  Respiratory Support
</label>
