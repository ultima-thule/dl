__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime


def _initMongoConn ():
    connect('leankit')

if __name__ == '__main__':
    _initMongoConn()

    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='Current development plan')).order_by('extended_data__sponsor_name')
    if len(cards) > 0:
        for card in cards:


    exit(0)
    # print("done.")
