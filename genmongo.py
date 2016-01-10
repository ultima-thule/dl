__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime

def _initMongoConn ():
    connect('leankit')

if __name__ == '__main__':
    _initMongoConn()

    # teams = lib.mongoLeankit.Team.objects().order_by('location', 'name')
    # for team in teams:
    #     print (team.id, ";", team.name)
    # print("done.")

    cards = lib.mongoLeankit.Card.objects(board_masterlane_title="Current development plan").order_by('title')
    for card in cards:
        print(card.id, ";", card.title, card.team_name)
    print("done.")

# "db.team.update({"_id": ObjectId("_")}, {$set: {"default_category": "IT Platforms"}})"