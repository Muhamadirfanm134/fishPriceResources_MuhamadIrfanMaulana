import {
  CloseOutlined,
  ExclamationCircleOutlined,
  FilterFilled,
  PushpinFilled,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Slider,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { notFound, searchIcon } from "../../assets";
import {
  CardComponent,
  CardFilterComponent,
  CardHeaderComponent,
  PlainCardComponent,
} from "../../components/card";
import Gap from "../../components/gap/Gap";
import LoadingComponent from "../../components/loading/LoadingComponent";
import { locationSelectors } from "../../features/locationSlice";
import { resourceSelectors } from "../../features/resourceSlice";
import { sizeSelectors } from "../../features/sizeSlice";
import {
  deleteResources,
  getLocations,
  getResources,
  getSizes,
} from "../../service/service";
import "./ResourceList.scss";

const ResourceList = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [currentPage, setCurrentPage] = useState(1);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(12);
  const [search, setSearch] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [city, setCity] = useState();
  const [province, setProvince] = useState();
  const [size, setSize] = useState();
  const [price, setPrice] = useState();

  const numEachPage = 12;

  const onChange = (value) => {
    setCurrentPage(value);
    setMinValue((value - 1) * numEachPage);
    setMaxValue(value * numEachPage);
  };

  const resourceList = useSelector(resourceSelectors.selectAll)
    ?.filter((resource) => resource?.komoditas !== null)
    .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  const locationList = useSelector(locationSelectors.selectAll);
  const sizeList = useSelector(sizeSelectors.selectAll);

  useEffect(() => {
    dispatch(getResources());
    dispatch(getLocations());
    dispatch(getSizes());
  }, [dispatch]);

  const [resource_data = [...resourceList], setDataValue] = useState();
  const total = resource_data?.length;

  const provinceData = locationList
    ?.filter(
      (ele, ind) =>
        ind ===
          locationList.findIndex((elem) => elem.province === ele.province) &&
        ele.province
    )
    .sort((a, b) => (a.province > b.province ? 1 : -1))
    ?.map((location) => ({
      value: location?.province,
      label: location?.province,
    }))
    .filter((location) => location?.value !== null);

  const cityData = locationList
    ?.filter(
      (ele, ind) =>
        ind === locationList.findIndex((elem) => elem.city === ele.city) &&
        ele.city
    )
    .sort((a, b) => (a.city.trim() > b.city.trim() ? 1 : -1))
    ?.map((location) => ({
      value: location?.city,
      label: location?.city,
    }))

    .filter((location) => location?.value !== null);

  const sizeData = sizeList
    .sort((a, b) => (parseInt(a.size) > parseInt(b.size) ? 1 : -1))
    ?.map((e) => ({
      value: e?.size,
      label: e?.size,
    }));

  if (provinceData && cityData && sizeData) {
    localStorage.setItem("provinceData", JSON.stringify(provinceData));
    localStorage.setItem("cityData", JSON.stringify(cityData));
    localStorage.setItem("sizeData", JSON.stringify(sizeData));
  }

  const handleEdit = (resource) => {
    localStorage.setItem("resourceData", JSON.stringify(resource));
    navigate(`/edit/${resource?.uuid}`);
    window.location.reload(false);
  };

  const handleDelete = (uuid) => {
    let values = {
      condition: { uuid: uuid },
    };

    confirm({
      centered: true,
      title: "Are you sure delete this data?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",

      onOk() {
        dispatch(deleteResources(values))
          .then(() => {
            dispatch(getResources());
          })
          .then(
            Swal.fire({
              icon: "success",
              showConfirmButton: false,
              showCloseButton: true,
              text: `Successfully delete data`,
            })
          );
      },
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    searchData("search", e.target.value);
  };

  const handleCityChange = (value) => {
    setCity(value);
    searchData("city", value);
  };

  const handleProvinceChange = (value) => {
    setProvince(value);
    searchData("province", value);
  };

  const handleSizeChange = (value) => {
    setSize(value);
    searchData("size", value);
  };

  const onChangeSlider = (newValue) => {
    setPrice(newValue);
    searchData("price", newValue);
  };

  const searchData = (type, value) => {
    const citySelected = type === "city" ? value : city;
    const provinceSelected = type === "province" ? value : province;
    const sizeSelected = type === "size" ? value : size;
    const priceSelected = type === "price" ? value : price;
    const searchData = type === "search" ? value : search;

    setDataValue(
      resourceList?.filter((resource) => {
        const isMatchProvince = provinceSelected
          ? resource?.area_provinsi?.toLowerCase().includes(provinceSelected)
          : true;

        const isMatchCity = citySelected
          ? resource?.area_kota?.toLowerCase() === citySelected
          : true;

        const isMatchSize = sizeSelected
          ? resource?.size?.toLowerCase() === sizeSelected
          : true;

        const isMatchPrice = priceSelected
          ? resource?.price >= priceSelected[priceSelected?.length - 2] &&
            resource?.price <= priceSelected[priceSelected?.length - 1]
          : true;

        const isMatch = searchData
          ? resource?.komoditas
              .toLowerCase()
              .includes(searchData?.toLowerCase())
          : true;

        return (
          isMatch &&
          isMatchCity &&
          isMatchProvince &&
          isMatchSize &&
          isMatchPrice
        );
      })
    );

    setCurrentPage(1);
    setMinValue(0);
    setMaxValue(12);
  };

  const onReset = () => {
    form.resetFields();
    setSearch();
    setCity();
    setProvince();
    setSize();
    setPrice();
    setDataValue(resourceList);
  };

  const maxPrice = Math.max.apply(
    null,
    resourceList?.map((data) => data?.price)
  );

  return (
    <>
      <CardHeaderComponent>
        <div className="cardTitle">Fish Resources List</div>
        <div className="subTitle">Fish Price Data in Indonesia</div>
        <div className="divider" />

        <Button
          className="primaryButton"
          shape="round"
          onClick={(e) => {
            localStorage.removeItem("resourceData");
            navigate("/add");
          }}
        >
          Add Data
        </Button>
      </CardHeaderComponent>

      <CardFilterComponent>
        <Row gutter={[10]} align="middle">
          <Col xs={16} sm={18} md={18} lg={18} xl={20}>
            <Input
              className="searchComponent"
              placeholder="Type your keyword by commodity"
              prefix={
                <img
                  alt="Search-Icon"
                  src={searchIcon}
                  className="searchIconStyle"
                />
              }
              value={search}
              onChange={handleSearchChange}
            />
          </Col>
          <Col xs={8} sm={6} md={6} lg={6} xl={4}>
            <Button
              className="secondaryButton"
              icon={<FilterFilled />}
              shape="round"
              block
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              Filter
            </Button>
          </Col>
        </Row>
        {isFilterVisible && (
          <>
            <Gap height={10} />
            <div className="filter-container">
              <Row>
                <Col span={12}>
                  <div>
                    <b>Advanced Filter</b>
                  </div>
                </Col>
                <Col span={12} align="end">
                  <Button
                    className="filter-close-icon"
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setIsFilterVisible(false);
                      onReset();
                    }}
                  />
                </Col>
              </Row>
              <Gap height={10} />

              <Form form={form} layout="vertical" id="form1">
                <Row gutter={[20]}>
                  <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item name="city" label="City">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select City"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleCityChange}
                      >
                        {cityData?.map(({ value, label }, i) => {
                          return (
                            <Option key={i} value={value?.toLowerCase()}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item name="province" label="Province">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select Province"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleProvinceChange}
                      >
                        {provinceData?.map(({ value, label }, i) => {
                          return (
                            <Option key={i} value={value?.toLowerCase()}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item name="size" label="Size">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select Size"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleSizeChange}
                      >
                        {sizeData?.map(({ value, label }, i) => {
                          return (
                            <Option key={i} value={value}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item name="price" label="Price">
                      <Slider
                        range
                        max={maxPrice}
                        step={50000}
                        tooltip={{
                          formatter: (value) =>
                            `Rp` +
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                        }}
                        onChange={onChangeSlider}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={10}>
                  <Col xs={8} sm={4} md={4} lg={4} xl={4}>
                    <Button
                      type="danger"
                      shape="round"
                      size="small"
                      block
                      onClick={onReset}
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
                <Gap height={10} />
              </Form>
            </div>
          </>
        )}
      </CardFilterComponent>

      {resource_data?.length > 0 ? (
        <>
          <Row gutter={[20, 0]}>
            {resource_data.slice(minValue, maxValue).map((resource, index) => (
              <Col xs={24} sm={24} md={12} lg={12} xl={8} key={index}>
                <PlainCardComponent>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div className="fishName">{resource?.komoditas}</div>
                      <div className="price">
                        Rp
                        {resource?.price
                          ?.toString()
                          ?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </div>
                      {resource?.area_kota && resource?.area_provinsi && (
                        <span className="location">
                          <PushpinFilled />{" "}
                          <span>
                            {resource?.area_kota} - {resource?.area_provinsi}
                          </span>
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Gap height={10} />
                  <Divider style={{ marginTop: "5px", marginBottom: "10px" }} />
                  <Row align="middle">
                    <Col xs={16} sm={18} md={14} lg={14} xl={16}>
                      <div className="location">Size: {resource?.size}</div>
                    </Col>
                    <Col xs={8} sm={6} md={10} lg={10} xl={8}>
                      <Row justify="end">
                        <Col span={12}>
                          <Button
                            className="primaryButton"
                            size="small"
                            shape="round"
                            onClick={() => {
                              handleEdit(resource);
                            }}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button
                            type="primary"
                            danger
                            size="small"
                            shape="round"
                            onClick={() => {
                              handleDelete(resource?.uuid);
                            }}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </PlainCardComponent>
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={12}
            onChange={onChange}
            total={total}
            showTotal={(total) => `Total ${total} data's`}
          />
        </>
      ) : (
        <>
          {resourceList?.length === 0 ? (
            <LoadingComponent />
          ) : resource_data?.length === 0 ? (
            <CardComponent>
              <div className="notFoundStyle">
                <img alt="Not-Found" src={notFound} />
                <div>Data Not Found</div>
              </div>
            </CardComponent>
          ) : null}
        </>
      )}
    </>
  );
};

export default ResourceList;
