export async function pagingQueryHandler(
  {
    page,
    query,
    isInQueryMode,
    currentPage,
    change,
    totalPages,
  }: {
      page: string,
      query: string, 
      isInQueryMode: boolean, 
      currentPage: number, 
      change: number, 
      totalPages: number
    }
    ): Promise<{
        error: string,
        errorLoc: string,
        list: any[],
        totalPages: number,
        currentPage: number,
  }> {
  let body;
  let dest;
  let destList: {paging: string, search: string};

  if (page === "admins") {
    destList = { paging: "/handlers/adminPaging", search: "/handlers/adminSearch" }
  } else if (page === "logs") {
    destList = { paging: "/handlers/controlHistoryPaging", search: "/handlers/controlHistorySearch" }
  } else if (page === "divisions") {
    destList = { paging: "/handlers/divisionPaging", search: "/handlers/divisionSearch" }
  } else {
    destList = { paging: "/handlers/servicePaging", search: "/handlers/serviceSearch" }
  }

  try {

    if (isInQueryMode) {
      body = JSON.stringify({ query, currPage: currentPage, change, maxPages: totalPages });
      dest = destList.search
    } else {
      body = JSON.stringify({ currPage: currentPage, change, maxPages: totalPages });
      dest = destList.paging
    }

    const response = await fetch(dest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const rv = await response.json();

    let error = '';
    let errorLoc = '';
    let list = [];
    totalPages = 1;
    currentPage = 1;

    if (rv.success) {
      list = rv.list
      totalPages = rv.totalPages
      currentPage = rv.currentPage

    } else {
      error = rv.error

      if (rv.description === "admins" && page === "admins"){
        errorLoc = "admins"
      } else if (rv.description === "logs" && page === "logs"){
        errorLoc = "logs"
      } else if (rv.description === "divisions" && page === "divisions"){
        errorLoc = "divisions"
      } else if (rv.description === "services" && page === "services"){
        errorLoc = "services"
      } else {
        errorLoc = "query"
      }
    }
    return {
      error,
      errorLoc,
      list,
      totalPages,
      currentPage,
    }
    
  } catch (error) {
    throw new Error(`Response status: ${error}`);
  }
}

export async function getAdminData(adminID: String): Promise<{
        firstname: string,
        middlename: string,
        lastname: string,
        divisions: string[],
  }> {
  const body = JSON.stringify({adminID});

  try {
    const response = await fetch("/handlers/adminInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const rv = await response.json();

    return {
      firstname: rv.fname,
      middlename: rv.mname,
      lastname: rv.lname,
      divisions: rv.divisions,
    }

  } catch (error) {
    throw new Error(`Response status: ${error}`);
  }
}

export async function resetAdminPassword(adminID:String, passwordConfirmation:String): Promise<{
  value:string, 
  success:boolean,

}> {
  const body = JSON.stringify({adminID, passwordConfirmation});

  try {
    const response = await fetch("/handlers/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const rv = await response.json();

    if (rv.success) {
      return {
        value: rv.newpass,
        success: true,
      }
    } else {
      return{
        value: rv.error,
        success: false,
      }
    }
    
  } catch (error) {
    throw new Error(`Response status: ${error}`);
  }
}

