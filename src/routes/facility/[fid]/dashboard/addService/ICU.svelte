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
