__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime


def _initMongoConn ():
    connect('leankit', host='10.188.128.11')

def _initSponsorsDict ():
    spons_dict = {}
    sponsors = lib.mongoLeankit.Sponsor.objects()
    for i in sponsors:
        spons_dict[i.tag] = i.name + " (" + i.bo_name + ")"
    return spons_dict


if __name__ == '__main__':
    _initMongoConn()

    excelReport = lib.excel.ExcelReport(datetime.datetime.now().strftime("Status_%Y-%m-%d-%H-%M-%S.xlsx"),
                         "Portfolio DreamLab")
    excelReport.initReport(_initSponsorsDict ())

    last_sponsor = "Not defined"
    sponsor_sum_in_progress = 0
    sponsor_sum_total = 0
    sum_in_progress = 0
    sum_total = 0
    # teams = lib.mongoLeankit.Team.objects().order_by('location', 'name')
    # for team in teams:

    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='Current development plan')).order_by('extended_data__sponsor_name', 'title')
    if len(cards) > 0:
        for index, card in enumerate(cards):
            if card.extended_data.sponsor_name != last_sponsor:
                if index != 0:
                    excelReport.writeSummary(sponsor_sum_in_progress, sponsor_sum_total, "Total for sponsor")
                last_sponsor = card.extended_data.sponsor_name
                sponsor_sum_in_progress = 0
                sponsor_sum_total = 0
                excelReport.laneBreak()
                excelReport.writeSponsor(last_sponsor)
            excelReport.writeCard(card)
            if card.taskboard_completed_card_size is not None:
                sum_in_progress += card.taskboard_completed_card_size
                sponsor_sum_in_progress += card.taskboard_completed_card_size
            if card.taskboard_total_size is not None:
                sum_total += card.taskboard_total_size
                sponsor_sum_total += card.taskboard_total_size
        excelReport.writeSummary(sponsor_sum_in_progress, sponsor_sum_total, "Total for sponsor")
        excelReport.writeSummary(sum_in_progress, sum_total, "IT Production total")

    data = excelReport.close()

    # print("Report generated, saving to database...")
    report = lib.mongoLeankit.Report()

    report.xls_data = data
    report.generation_date = datetime.datetime.now()

    report.save()
    exit(0)
    # print("done.")
