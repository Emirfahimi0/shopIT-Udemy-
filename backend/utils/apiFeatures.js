class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    
    search(){
        const keyword = this.queryStr.keyword ? {
            
            name :{
                $regex : this.queryStr.keyword,
                $options : 'i'
            }

        }:{} //empty object 

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
 
    const queryCopy = {...this.queryStr};
    
    //removing fields from query
    const removefields = ['keyword', 'limit','page']
    removefields.forEach(el =>delete queryCopy[el]);

    //Advanced filter for price,rating and etc...
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match =>`$${match}`)

    this.query = this.query.find(JSON.parse(queryStr));
    return this;

    

}

pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
}



}

module.exports = APIFeatures    