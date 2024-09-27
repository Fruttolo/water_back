import { getAllMenuByUserId, addMenuItem, deleteMenuItem } from '../db/menu';
import { get } from 'lodash';
import express from 'express';

export const getMenu = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');
    
        const menu = await getAllMenuByUserId(id);

        return res.status(200).json(menu);

    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

export const addMenu = async (req: express.Request, res: express.Response) => {
    try{

        const user = get(req, 'identity');
        const id = get(user, 'id');
        const description = get(req, 'body.description');

        if (!description) {
            return res.status(400).send('Description is required');
        }

        await addMenuItem(description, id);

        return res.status(200).send('Item added');

    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}

export const deleteMenu = async (req: express.Request, res: express.Response) => {
    try{

        const { menu_id } = req.params;

        if (!menu_id) {
            return res.status(400).send('ID is required');
        }

        await deleteMenuItem(parseInt(menu_id));

        return res.status(200).send('Item deleted');

    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }
}