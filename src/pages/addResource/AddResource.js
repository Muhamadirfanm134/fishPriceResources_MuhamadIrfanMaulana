import { Col, Row } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import JsonToForm from "json-reactform";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { CardComponent, CardHeaderTwoComponent } from "../../components/card";
import Gap from "../../components/gap/Gap";
import Schema from "../../schema";
import { addResources } from "../../service/service";

const AddResource = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (params) => {
    console.log(params);
    let id = uuidv4();
    let timestamp = Date.now();
    let tgl_parsed = new Date().toISOString();
    const values = [
      {
        uuid: id,
        komoditas: params?.Komoditas.toUpperCase(),
        area_provinsi: params?.Province?.value,
        area_kota: params?.City?.value,
        size: params?.Size?.value,
        price: params?.Price,
        timestamp: timestamp,
        tgl_parsed: tgl_parsed,
      },
    ];

    console.log({ values });
    await dispatch(addResources(values));
    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      showCloseButton: true,
      text: `Successfully add data`,
    }).then(() => {
      navigate("/");
    });
  };
  return (
    <>
      <CardHeaderTwoComponent>
        <div className="cardTitle">Add Data</div>
        <div className="divider" />
      </CardHeaderTwoComponent>
      <Gap height={5} />
      <CardComponent>
        <Row justify="center">
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <JsonToForm model={Schema} onSubmit={submit} />
          </Col>
        </Row>
      </CardComponent>
    </>
  );
};

export default AddResource;
