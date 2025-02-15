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
  Load
  <input 
    name="load" 
    type="text"
    placeholder="steady, closed (to update to drop down)"
    required
  >
</label>

<label>
  Available Beds
  <input 
    name="availableBeds" 
    type="number"
    placeholder=100
    class = "w-20"
    required
  >
</label>

<label>
  # of non-urgent patients being attended to
  <input 
    name="nonUrgentAttended" 
    type="number"
    placeholder=3
    class = "w-20"
    required
  >
</label>

<label>
  # of non-urgent patients in queue
  <input 
    name="nonUrgentQueue" 
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
</label>

<label>
  # of urgent patients being attended to
  <input 
    name="urgentAttended"
    type="number"
    placeholder=5
    class = "w-20"
    required
  >
</label>

<label>
  # of urgent patients in queue
  <input 
    name="urgentQueue" 
    type="number"
    placeholder=0
    class = "w-20"
    required
  >
</label>

<label>
  # of critical patients being attended to
  <input 
    name="criticalAttended"
    type="number"
    placeholder=1
    class = "w-20"
    required
  >
</label>

<label>
  # of critical patients in queue
  <input 
    name="criticalQueue" 
    type="number"
    placeholder=0
    class = "w-20"
    required
  >
</label>