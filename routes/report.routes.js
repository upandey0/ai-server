import express from 'express'

const router = express.Router()

router.get('/api/user/report', ()=>{
    // What will be the process of providing data to the user : 

    /*  allReports = from the Report find all reports belongs to USER : 



        categoryWiseReport = {
            categoryName : [ {report1}, {report2}]
        }

        We can put this categoryWise data is User table itself. # decrease number of computations

        Now We to arrange this data Location Wise :  

            Arrange this data officeLocation wise : 

            traveseData of category wise and map it with office wise: and in array keep only data which belongs to the user.

            
    
    */
})

export default router