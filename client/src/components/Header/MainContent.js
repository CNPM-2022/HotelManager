import { Link } from 'react-router-dom';
import images from '../../assets/images';

const MainContent = () => {
    return (
        <>
            {/* <Navbar style={{ backgroundColor: '#282828', fontSize: '14px' }} className="py-1 justify-content-center">
                <Nav>
                    <li className="nav-item">
                        <Link style={{ color: 'white' }} className="nav-link active" aria-current="page" to="/rooms">
                            <strong>ROOMS & SUITES</strong>{' '}
                        </Link>
                    </li>
                    <li className="nav-item" style={{ textIndent: '60px' }}>
                        <Link style={{ color: 'white' }} className="nav-link active" aria-current="page" to="/admins">
                            <strong>ADMIN</strong>
                        </Link>
                    </li>
                    <li className="nav-item" style={{ textIndent: '60px' }}>
                        <Link style={{ color: 'white' }} className="nav-link active" aria-current="page" to="/foods">
                            {' '}
                            <strong>TAKE & DELIVERY</strong>
                        </Link>
                    </li>
                    <li className="nav-item dropdown" style={{ textIndent: '60px' }}>
                        <Link
                            style={{ color: 'white' }}
                            className="nav-link  active dropdown-toggle"
                            to="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <strong>WEDDING & EVENTS</strong>
                        </Link>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <Link className="dropdown-item" to="/weddings">
                                    <b>WEDDINGS PLANNING</b>
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/conference">
                                    <b>MEETINGS</b>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item" style={{ textIndent: '60px' }}>
                        <Link style={{ color: 'white' }} className="nav-link active" aria-current="page" to="/weddings">
                            <strong>ABOUT</strong>
                        </Link>
                    </li>
                </Nav>
            </Navbar> */}

            <div className="main-header-area">
                <div className="container">Navbar</div>
            </div>
        </>
    );
};

export default MainContent;
