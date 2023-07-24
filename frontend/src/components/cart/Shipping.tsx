import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState,AppDispatch } from '../../store'
import MetaData from '../layout/MetaData'
import { saveShippingInfo } from '../../actions'

interface IShipping {
    history: ["/confirm"];

}


 const Shipping :React.FunctionComponent<IShipping> = ({history}:IShipping) => {

    const {shippingInfo} = useSelector((state:RootState)=> state.cart)
    const [shippingInformation,setShippingInformation] = useState<IShippingInfo>(shippingInfo);
    const dispatch: AppDispatch = useDispatch()

    let shippingInformations:IShippingInfo = {

        address: "",
        city: "",
        postalCode:"",
        phoneNum:"",
        country: ""
    }


    const submitHandler = (e:any) => {
        e.preventDefault();
        setShippingInformation(shippingInformations)

        dispatch(saveShippingInfo(shippingInformation))
        history.push('/confirm')
    }


  return (
    <Fragment>
<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg">
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={shippingInformation.address}
                                onChange={(e) => shippingInformations.address = e.target.value}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                  value={shippingInformation.city}
                                onChange={(e) => shippingInformations.city = e.target.value}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={shippingInformation.phoneNum}
                                onChange={(e) => shippingInformations.phoneNum = e.target.value}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={shippingInformation.postalCode}
                                onChange={(e) => shippingInformations.postalCode = e.target.value}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value=''
                                required
                            >
                                    <option>
                                        USA
                                    </option>

                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            onSubmit={submitHandler}
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                            </button>
                    </form>
                </div>
            </div>

    </Fragment>
  )
}
export default Shipping
