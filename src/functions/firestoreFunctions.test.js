import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../pages/firebase";
import { saveBuyerToFirestore, saveSellerToFirestore, saveProductToFirestore, doesEmailExistInSellerCollection } from "../functions/firestoreFunctions";

jest.mock('firebase/firestore');

describe('Firestore Functions', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        collection.mockClear();
        addDoc.mockClear();
        query.mockClear();
        where.mockClear();
        getDocs.mockClear();
    });

    it('Should add buyer to firestore', async () => {
        const mockUser = {
            email: 'test@example.com',
            uid: '1234'
        };

        const mockName = 'Test Name';
        const mockMobileNumber = '1234567890';

        await saveBuyerToFirestore(mockUser, mockName, mockMobileNumber);
        expect(collection).toHaveBeenCalledWith(db, 'buyers');
        expect(addDoc).toHaveBeenCalled();
    });

    it('Should add seller to firestore', async () => {
        const mockUser = {
            uid: '1234'
        };

        const mockSellerData = {
            firstName: 'Test',
            lastName: 'Name',
            mobileNumber: '1234567890',
            companyName: 'Test Company',
            companyTelephone: '0987654321',
            companyEmail: 'company@test.com'
        };

        await saveSellerToFirestore(mockUser, ...Object.values(mockSellerData));
        expect(collection).toHaveBeenCalledWith(db, 'sellers');
        expect(addDoc).toHaveBeenCalled();
    });

    it('Should add product to firestore', async () => {
        const mockProduct = {
            brand: 'Test Brand',
            name: 'Test Product',
            description: 'This is a test product',
            tags: ['tag1', 'tag2'],
            price: 100,
            stock: 10,
            image: 'http://example.com/image.jpg',
            sellerEmail: 'seller@test.com'
        };

        await saveProductToFirestore(...Object.values(mockProduct));
        expect(collection).toHaveBeenCalledWith(db, 'Products');
        expect(addDoc).toHaveBeenCalled();
    });

    it('Should check if email exists in sellers collection', async () => {
        const mockEmail = 'test@example.com';
        const mockEmailType = 'companyEmail';

        getDocs.mockResolvedValue({
            empty: false,
        });

        const result = await doesEmailExistInSellerCollection(mockEmail, mockEmailType);
        expect(collection).toHaveBeenCalledWith(db, 'sellers');
        expect(query).toHaveBeenCalled();
        expect(where).toHaveBeenCalledWith(mockEmailType, '==', mockEmail);
        expect(result).toBe(true);
    });
});