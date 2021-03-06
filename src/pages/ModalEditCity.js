import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ErrorMessage from "../messages/errorMessage";
import validateCities from "../validation/CityValidationRules";

function ModalEditCity(props) {

    const [cityDto, setCityDto] = useState({
        id: '',
        city: '',
        recommendation: '',
    });

    const [errors, setErrors] = useState({
        validationErrors: [],
        serverErrors: ''
    });

    useEffect(() => {
        if (props.editCity.editShow === true) {
            fetch(`/resliv/city/${props.editCity.city.id}`)
                .then(response => response.json())
                .then(res => {
                    setCityDto(res);
                })
        }
    }, [props.editCity.editShow]);

    const handleCity = (e) => {
        setCityDto(preState => ({
            ...preState,
            city: e.target.value
        }));
    };

    const handleRecommendation = (e) => {
        setCityDto(preState => ({
            ...preState,
            recommendation: e.target.value
        }));
    };

    const editCityHandler = (e) => {
        e.preventDefault();

        let validationResult = validateCities(cityDto);
        setErrors(preState => ({
            ...preState,
            validationErrors: validationResult
        }));

        if (!validationResult.length) {
            fetch(`/resliv/city`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cityDto)
            })
                .then(function (response) {
                    if (response.status !== 202 || errors.serverErrors !== '') {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: "Something went wrong, try later",
                        }));
                    } else {
                        setErrors(preState => ({
                            ...preState,
                            serverErrors: '',
                            validationErrors: []
                        }));
                        props.onChange(false, cityDto);
                    }
                });
        }
    };

    return (
        <>
            <Modal
                show={props.editCity.editShow}
                backdrop="static"
                onHide={() => {
                    setErrors({
                        validationErrors: [],
                        serverErrors: ''
                    });
                    props.onChange(false);
                }}
                aria-labelledby="modal-warehouse"
                className="shadow"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-warehouse">
                        Edit city
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
                    <Form>
                        <Form.Group controlId="city" style={{padding: '5px 10px'}}>
                            City
                            <Form.Control type="text" placeholder="city"
                                          onChange={handleCity}
                                          value={cityDto.city}
                                          className={errors.validationErrors.includes("city")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid city.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="recommendation" style={{padding: '5px 10px'}}>
                            Recommendation
                            <Form.Control type="text" placeholder="recommendation"
                                          onChange={handleRecommendation}
                                          value={cityDto.recommendation}
                                          className={errors.validationErrors.includes("recommendation")
                                              ? "form-control is-invalid" : "form-control"}/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid recommendation.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="float-right" style={{paddingRight: '10px'}}>
                            <Button type="submit" className="mainButton pull-right"
                                    onClick={editCityHandler}>
                                Save
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalEditCity;
