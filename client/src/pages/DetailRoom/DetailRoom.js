import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import bookingSlice from '../../store/bookingSlice';
import { toast } from 'react-toastify';

import { Link, useParams, useNavigate } from 'react-router-dom';
import './DetailRoom.scss';
import { getRoomById } from '../../services/apiServices';
import { addFavoriteRoom, checkFavoriteRoom, deleteFavoriteRoom, getAllRoomTypes } from '../../services/apiServices';
import { FaHeartBroken } from 'react-icons/fa';
import DateRange from '../../components/DateRange/DateRange';
import searchSlice from '../../store/searchSlice';
import SimilarRooms from './SimilarRooms';

import icon1 from '../../assets/images/detailRoom/icon1.png';
import icon2 from '../../assets/images/detailRoom/icon2.png';
import icon3 from '../../assets/images/detailRoom/icon3.png';
import icon4 from '../../assets/images/detailRoom/icon4.png';
import icon5 from '../../assets/images/detailRoom/icon5.png';
import icon6 from '../../assets/images/detailRoom/icon6.png';
import avt1 from '../../assets/images/detailRoom/53.jpg';
import avt2 from '../../assets/images/detailRoom/54.jpg';
import avt3 from '../../assets/images/detailRoom/55.jpg';

const DetailRoom = () => {
    const serverURL = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    const initalDateRange = [
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ];
    const dispatch = useDispatch();
    const params = useParams();
    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [roomType, setRoomType] = useState([]);
    const [dateRange, setDateRange] = useState(initalDateRange);
    const [isShowDateRange, setIsShowDateRange] = useState(false);

    let autoIncrease = 0;

    const checkFavoriteRoomFunc = async (roomId) => {
        try {
            const res = await checkFavoriteRoom(roomId);
            const data = res.data;
            if (res.status !== 200) {
                throw new Error(data.message);
            }
            setIsFavorite(data.success);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddFavorite = async () => {
        const res = await addFavoriteRoom(params.id);
        setIsFavorite(true);
    };

    const handleRemoveFavorite = async () => {
        const res = await deleteFavoriteRoom(params.id);
        setIsFavorite(false);
    };

    const GetDetailRoom = async (roomId) => {
        try {
            const res = await getRoomById(roomId);
            const data = res.data;
            if (res.status !== 200) {
                throw new Error(data.message);
            }
            setRoom(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeDateRange = (item) => {
        setDateRange([item.selection]);
    };

    const handleSearch = () => {
        dispatch(
            searchSlice.actions.setSearchContent({
                dateStart: dateRange[0].startDate.toString(),
                dateEnd: dateRange[0].endDate.toString(),
                type: document.getElementById('type-room').value,
                price: document.getElementById('price-room').value,
            }),
        );
        navigate('/search/1');
    };

    const getAllTypeRoom = async () => {
        const res = await getAllRoomTypes();
        setRoomType(res.data.data);
    };

    useEffect(() => {
        setLoading(true);
        GetDetailRoom(params.id);
        getAllTypeRoom();
        setLoading(false);
        checkFavoriteRoomFunc(params.id);
        document.documentElement.scrollTop = 0;
    }, [params.id]);

    const handleBookNow = () => {
        dispatch(
            bookingSlice.actions.setMaxPeople({
                maxPeopel: room.maxCount,
            }),
        );
    };

    if (loading || room._id === undefined) {
        return (
            <div className="d-flex justify-content-center align-items-center " style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    } else {
        return (
            <>
                <div className="breadcrumb-area bg-img bg-overlay jarallax">
                    <div className="container h-100">
                        <div className="row h-100 align-items-end">
                            <div className="col-12">
                                <div className="breadcrumb-content d-flex align-items-center justify-content-between pb-5">
                                    <h2 className="room-title">Ph??ng #{room.roomNumber}</h2>
                                    <h2 className="room-price">
                                        {room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VN??{' '}
                                        <span>/ Ng??y</span>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="roberto-rooms-area section-padding-100-0">
                    <div className="container-fluid" style={{ maxWidth: '1400px' }}>
                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <div className="single-room-details-area mb-50">
                                    <div className="room-thumbnail-slides mb-3">
                                        <div
                                            id="room-thumbnail--slide"
                                            className="carousel slide"
                                            data-bs-ride="carousel"
                                        >
                                            <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                    <img
                                                        src={`${serverURL + room.imageUrls[0].filePath}`}
                                                        className="d-block w-100"
                                                        alt=""
                                                    />
                                                </div>
                                                {room.imageUrls.slice(1).map((room) => (
                                                    <div className="carousel-item" key={room.fileName}>
                                                        <img
                                                            src={`${serverURL + room.filePath}`}
                                                            className="d-block w-100"
                                                            alt=""
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <ol className="carousel-indicators">
                                                <li
                                                    data-bs-target="#room-thumbnail--slide"
                                                    data-bs-slide-to="0"
                                                    className="active"
                                                >
                                                    <img
                                                        src={`${serverURL + room.imageUrls[0].filePath}`}
                                                        className="d-block w-100"
                                                        alt=""
                                                    />
                                                </li>
                                                {room.imageUrls.slice(1).map((room) => (
                                                    <li
                                                        data-bs-target="#room-thumbnail--slide"
                                                        key={room.fileName}
                                                        data-bs-slide-to={(autoIncrease += 1)}
                                                    >
                                                        <img
                                                            src={`${serverURL + room.filePath}`}
                                                            className="d-block w-100"
                                                            alt=""
                                                        />
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex justify-content-evenly">
                                        <Link to={`/booking/${room._id}`} onClick={handleBookNow}>
                                            <button className="button-detail-room book-btn">?????t ph??ng ngay</button>
                                        </Link>
                                        {isFavorite ? (
                                            <button
                                                className="button-detail-room  unfavorite-btn"
                                                onClick={handleRemoveFavorite}
                                            >
                                                ???? y??u th??ch
                                                <FaHeartBroken size={20} className="heart position-absolute" />
                                            </button>
                                        ) : (
                                            <button
                                                className="button-detail-room  favorite-btn"
                                                onClick={handleAddFavorite}
                                            >
                                                Y??u th??ch
                                            </button>
                                        )}
                                    </div>

                                    <div className="room-features-area d-flex flex-wrap mb-50">
                                        <h6>
                                            Lo???i: <span>{room.type}</span>
                                        </h6>
                                        <h6>
                                            S???c ch???a: <span>T???i ??a {room.maxCount} ng?????i</span>
                                        </h6>
                                        <h6>
                                            D???ch v???: <span>{room.note}</span>
                                        </h6>
                                        <h6>
                                            ????nh gi??: <span>{Math.floor(Math.random() * 4) + 7}/10</span>
                                        </h6>
                                    </div>

                                    <h4>
                                        <b>Gi???i thi???u s?? l?????c</b>
                                    </h4>

                                    <p>{room.description}</p>
                                </div>

                                <div className="room-service mb-50">
                                    <h4>C??c d???ch v???</h4>

                                    <ul>
                                        <li>
                                            <img src={icon1} alt="" /> ??i???u h??a
                                        </li>
                                        <li>
                                            <img src={icon2} alt="" /> ????? u???ng
                                        </li>
                                        <li>
                                            <img src={icon3} alt="" /> Nh?? h??ng
                                        </li>
                                        <li>
                                            <img src={icon4} alt="" /> Ti vi
                                        </li>
                                        <li>
                                            <img src={icon5} alt="" /> Wifi
                                        </li>
                                        <li>
                                            <img src={icon6} alt="" /> Ph???c v??? 24/24
                                        </li>
                                    </ul>
                                </div>

                                <div className="room-review-area mb-100">
                                    <h4>????nh gi??</h4>

                                    <div className="single-room-review-area d-flex align-items-center">
                                        <div className="reviwer-thumbnail">
                                            <img src={avt1} alt="" />
                                        </div>
                                        <div className="reviwer-content">
                                            <div className="reviwer-title-rating d-flex align-items-center justify-content-between">
                                                <div className="reviwer-title">
                                                    <span>27 Aug 2022</span>
                                                    <h6>Tr???n Tu???n</h6>
                                                </div>
                                                <div className="reviwer-rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                            <p>
                                                Ph??ng ?????p, r???ng v?? s???ch h??n m??nh ngh??. Nh??n vi??n nhi???t t??nh, th??n thi???n,
                                                lu??n ch??o ????n v???i n??? c?????i. Gi?????ng ??m, ph??ng ?????y ????? ti???n nghi, toilet v??
                                                bu???ng t???m t??ch ri??ng r???t th??ch. R???t g???n bi???n lu??n, ??i v??i b?????c ch??n l??
                                                ra bi???n. ???????ng tr?????c kh??ch s???n
                                            </p>
                                        </div>
                                    </div>

                                    <div className="single-room-review-area d-flex align-items-center">
                                        <div className="reviwer-thumbnail">
                                            <img src={avt2} alt="" />
                                        </div>
                                        <div className="reviwer-content">
                                            <div className="reviwer-title-rating d-flex align-items-center justify-content-between">
                                                <div className="reviwer-title">
                                                    <span>27 Aug 2022</span>
                                                    <h6>Nguy???n Lan H????ng</h6>
                                                </div>
                                                <div className="reviwer-rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                            <p>
                                                Nh??n vi??n r???t nhi???t t??nh vui v???, ph??ng s???ch v?? tho???i m??i . B???a ??n s??ng
                                                r???t t???t. Ph??ng c??ch ??m t???t.Kh??ch s???n m???i, nh??n vi??n nhi???t t??nh chu ????o.
                                                Ngay trung t??m ph??? t??y an th?????ng
                                            </p>
                                        </div>
                                    </div>

                                    <div className="single-room-review-area d-flex align-items-center">
                                        <div className="reviwer-thumbnail">
                                            <img src={avt3} alt="" />
                                        </div>
                                        <div className="reviwer-content">
                                            <div className="reviwer-title-rating d-flex align-items-center justify-content-between">
                                                <div className="reviwer-title">
                                                    <span>27 Aug 2022</span>
                                                    <h6>Tr???n Lyly</h6>
                                                </div>
                                                <div className="reviwer-rating">
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                            </div>
                                            <p>
                                                S???ch s??? l???ch s???, d???ch v??? t???t v?? c??c b???n nh??n vi??n r???t th??n thi???n.G???n
                                                bi???n. ????? ??n s??ng ngon. Nh??n vi??n th??n thi???n, chuy??n nghi???p. Ph??ng b??i
                                                tr?? ?????p m???t. Gi?????ng ????i c???c r???ng
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <div className="hotel-reservation--area-detail mb-100">
                                    <form className="p-3">
                                        <div className="fw-bolder fs-5 mb-3">T??m ki???m</div>
                                        <div className="form-group mb-30">
                                            <div className="input-daterange" id="datepicker">
                                                <div className="row no-gutters">
                                                    <div className="col-12">
                                                        <div className="form-group ">
                                                            <label className="form-label">
                                                                <b>Ch???n ng??y nh???n/tr??? ph??ng:</b>
                                                            </label>
                                                            <DateRange
                                                                handleChangeDateRange={handleChangeDateRange}
                                                                dateRange={dateRange}
                                                                isShowDateRange={isShowDateRange}
                                                                setIsShowDateRange={setIsShowDateRange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mb-30">
                                            <div className="row">
                                                <div className="col-6">
                                                    <label htmlFor="type-room">
                                                        <b>Lo???i:</b>
                                                    </label>
                                                    <select
                                                        name="type-room"
                                                        id="type-room"
                                                        className="form-control form-select"
                                                    >
                                                        <option value="all">T???t c???</option>
                                                        {roomType.map((item) => (
                                                            <option key={item._id} value={item.typeOfRooms}>
                                                                {item.typeOfRooms}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-6">
                                                    <label htmlFor="price-room">
                                                        <b>Gi??:</b>
                                                    </label>

                                                    <select
                                                        name="price-room"
                                                        id="price-room"
                                                        className="form-control form-select"
                                                    >
                                                        <option value="1">D?????i 500k</option>
                                                        <option value="2">T??? 500k - 1 tri???u</option>
                                                        <option value="3">Tr??n 1 tri???u</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <button
                                                type="button"
                                                className="btn roberto-btn-detail roberto-btn w-100"
                                                onClick={handleSearch}
                                            >
                                                T??m ki???m
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* c??c ph??ng li??n quan */}
                                <div className="accordion mb-5" id="accordionExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button
                                                className="accordion-button collapsed text-primary"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="false"
                                                aria-controls="collapseOne"
                                            >
                                                <b>C??c ph??ng t????ng t???</b>
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                <SimilarRooms type={room.type} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

export default DetailRoom;
