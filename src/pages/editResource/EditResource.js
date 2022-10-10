import { Col, Row } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import JsonToForm from "json-reactform";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CardComponent, CardHeaderTwoComponent } from "../../components/card";
import Gap from "../../components/gap/Gap";
import myComponent from "../../schema/schemaEdit";
import { editResources } from "../../service/service";

const EditResource = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  const submit = async (params) => {
    console.log(params);

    let timestamp = Date.now();
    let tgl_parsed = new Date().toISOString();
    let values = {
      condition: { uuid: id },
      set: {
        komoditas: params?.Komoditas.toUpperCase(),
        area_provinsi: params?.Province?.value,
        area_kota: params?.City?.value,
        size: params?.Size?.value,
        price: params?.Price,
        timestamp: timestamp,
        tgl_parsed: tgl_parsed,
      },
    };

    console.log({ values });
    await dispatch(editResources(values));
    Swal.fire({
      icon: "success",
      showConfirmButton: false,
      showCloseButton: true,
      text: `Successfully edit data`,
    }).then(() => {
      navigate(-1);
    });
  };
  return (
    <>
      <CardHeaderTwoComponent>
        <div className="cardTitle">Edit Data</div>
        <div className="divider" />
      </CardHeaderTwoComponent>
      <Gap height={5} />
      <CardComponent>
        <Gap height={30} />
        <Row justify="center">
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <JsonToForm model={myComponent} onSubmit={submit} />
          </Col>
        </Row>
        <Gap height={30} />
      </CardComponent>
    </>
  );
};

export default EditResource;
