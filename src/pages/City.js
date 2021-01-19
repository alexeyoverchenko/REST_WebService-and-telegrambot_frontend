import React, {useEffect, useState} from "react";
import "../App.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TogglePage from "../components/TogglePage";
import {FaEdit} from "react-icons/fa";
import Table from "react-bootstrap/Table";
import Page from "../components/Page";
import CardContainer from "../components/CardContainer";
import "bootstrap/dist/css/bootstrap.min.css"
import ErrorMessage from "../messages/errorMessage";
import ModalAddCity from "./ModalAddCity";
import ModalEditCity from "./ModalEditCity";

export default () => {

    const [page, setPage] = useState({
        active: 1,
        currentPage: 1,
        countPerPage: 10,
        countPages: 1
    });

    const [checkBoxes, setCheckBox] = useState([]);
    const [cities, setCity] = useState([]);
    const [lgShow, setLgShow] = useState(false);
    const [editCity, setEditCity] = useState({
        editShow: false,
        city: []
    });

    const [errors, setErrors] = useState({
        serverErrors: ''
    });

    const handleCheckedChange = (cityId) => {
        let checkboxUpdate = checkBoxes.slice();

        const index = checkboxUpdate.indexOf(cityId);
        if (index > -1) {
            checkboxUpdate.splice(index, 1);
        } else {
            checkboxUpdate = [...checkboxUpdate, cityId];
        }
        setCheckBox(checkboxUpdate);
    };

    const handleCountPerPage = (e) => {
        e.preventDefault();
        setPage(preState => ({
            ...preState,
            countPerPage: e.target.value
        }));
        getCities(`/resliv/city?size=${e.target.value}`);
    };

    const changePage = (e) => {
        e.preventDefault();
        let currentPage = e.target.innerHTML - 1;
        getCities(`/resliv/city?page=${currentPage}&size=${page.countPerPage}`);
    };

    useEffect(() => {
        getCities(`/resliv/city?size=${page.countPerPage}`);
    }, []);

    function getCities(url) {
        fetch(url)
            .then(response => response.json())
            .then(commits => {
                setCity(commits.content);
                setPage({
                        active: (commits.pageable.pageNumber + 1),
                        countPerPage: commits.size,
                        countPages: commits.totalPages
                    });
                setErrors('');
            })
            .catch(error => setErrors("Something went wrong, try later"));
    }

    const closeModalEdit = (e, cityDto) => {
        setEditCity(
            preState => ({
                ...preState,
                editShow: false
            }));
        if (cityDto) {
            getCities(`/resliv/city?size=${page.countPerPage}`);
        }
    };

    const closeModalAdd = (e, cityDto) => {
        setLgShow(e);
        if (cityDto) {
            getCities(`/resliv/city?size=${page.countPerPage}`);
        }
    };

    function deleteCity() {
        fetch(`/resliv/city/delete-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkBoxes)
        }).then(response => {
                if (response.status !== 204) {
                    setErrors({
                        serverErrors: "Something went wrong, try later"
                    })
                } else {
                    setErrors({
                        serverErrors: ''
                    });
                    setCheckBox([]);
                    getCities(`/resliv/city?size=${page.countPerPage}`);
                }
            }
        )
    }

    const tableRows = cities && cities.map(city => (
        <tr key={city.id}>
            <td>{city.city}</td>
            <td>{city.recommendation}</td>
            <td><FaEdit style={{textAlign: 'center', color: '#1a7fa8'}}
                        size={'1.3em'}
                        onClick={() => {
                            setEditCity({
                                editShow: true,
                                city: city
                            });
                        }}/>
            </td>
            <td>
                <input type="checkbox"
                       checked={checkBoxes.find(e => e === city.id)}
                       onClick={() => handleCheckedChange(city.id)}/>
            </td>
        </tr>

    ));

    const modals =
        <React.Fragment>
            {errors.serverErrors && <ErrorMessage message={errors.serverErrors}/>}
            <ModalEditCity editCity={editCity} onChange={closeModalEdit}/>
            <ModalAddCity lgShow={lgShow} onChange={closeModalAdd}
            />
        </React.Fragment>;

    const header =
        <React.Fragment>
            <Row>
                <Col xs={6}>
                    <Button className="mainButton" size="sm" onClick={() => setLgShow(true)}>
                        Add
                    </Button>
                    <Button
                        variant="link"
                        disabled={checkBoxes.length === 0}
                        className="deleteButton" size="sm"
                        onClick={() => deleteCity()}>
                        Delete
                    </Button>
                </Col>
                <Col xs={6}>
                    <TogglePage props={page} onChange={handleCountPerPage}/>
                </Col>
            </Row>
        </React.Fragment>;

    const body =
        <React.Fragment>
            {cities.length > 0 &&
            <Table hover size="sm">
                <thead>
                <tr>
                    <th>City</th>
                    <th>Recommendation</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {tableRows}
                </tbody>
            </Table>}
            {cities.length > 0 &&
                <Page page={page} onChange={changePage}/>}
            {cities.length == 0 &&
                <span>Empty list of cities.</span>}
        </React.Fragment>;

    return (
        <CardContainer
            modals={modals}
            header={header}
            body={body}/>
    );
}
